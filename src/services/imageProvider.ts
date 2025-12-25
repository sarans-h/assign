import axios from 'axios'

export async function generateImage(prompt: string): Promise<string> {
  // In development, fall back to direct API calls (will have CORS issues)
  // In production, use the Vercel serverless function
  const isProduction = import.meta.env.PROD

  if (isProduction) {
    // Production: Use Vercel serverless function
    try {
      console.log('Production: Using Vercel serverless function')
      const response = await axios.post('/api/replicate', {
        prompt: prompt
      })
      console.log('Image generated successfully:', response.data.image)
      return response.data.image
    } catch (error: any) {
      console.error('Serverless function failed:', error)
      return getFallbackImage(prompt)
    }
  } else {
    // Development: Direct Replicate API call (may have CORS issues)
    console.log('Development: Using direct Replicate API call')
    return generateImageDirect(prompt)
  }
}

async function generateImageDirect(prompt: string): Promise<string> {
  const token = import.meta.env.VITE_REPLICATE_API_TOKEN
  const model = import.meta.env.VITE_REPLICATE_MODEL || 'black-forest-labs/flux-1.1-pro'

  if (!token) {
    console.error('No Replicate API token found')
    return getFallbackImage(prompt)
  }

  try {
    console.log('Starting direct image generation for prompt:', prompt)

    const start = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: model,
        input: {
          prompt: prompt,
          width: 1024,
          height: 1024,
          num_inference_steps: 25
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Prediction started:', start.data)
    const id = start.data.id

    if (!id) {
      console.error('No prediction ID received')
      return getFallbackImage(prompt)
    }

    let status = start.data.status
    let output = start.data.output

    console.log('Initial status:', status)

    while (status !== 'succeeded' && status !== 'failed' && status !== 'canceled') {
      await new Promise(r => setTimeout(r, 2000))

      try {
        const poll = await axios.get(`https://api.replicate.com/v1/predictions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        status = poll.data.status
        output = poll.data.output

        console.log('Polling status:', status, 'Output:', output)

        if (status === 'failed') {
          console.error('Prediction failed:', poll.data.error)
          return getFallbackImage(prompt)
        }

      } catch (pollError) {
        console.error('Error polling prediction:', pollError)
        return getFallbackImage(prompt)
      }
    }

    console.log('Final output:', output)

    if (Array.isArray(output) && output.length > 0) {
      return output[0]
    }
    if (typeof output === 'string') {
      return output
    }

    console.error('No valid output received')
    return getFallbackImage(prompt)

  } catch (error: any) {
    console.error('Direct API call failed:', error)
    console.error('This is expected in development due to CORS. Use production deployment for full functionality.')
    return getFallbackImage(prompt)
  }
}

function getFallbackImage(prompt: string): string {
  console.log('Returning placeholder image due to API failure')
  let placeholderText = 'Fitness Image'
  let bgColor = '6366f1' // Default blue

  return `https://dummyimage.com/400x300/${bgColor}/ffffff?text=${encodeURIComponent(prompt)}`
}
