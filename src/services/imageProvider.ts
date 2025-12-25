import axios from 'axios'

export async function generateImage(prompt: string): Promise<string> {
  const token = import.meta.env.VITE_REPLICATE_API_TOKEN
  const model = import.meta.env.VITE_REPLICATE_MODEL || 'black-forest-labs/flux-1.1-pro'

  if (!token) {
    console.error('No Replicate API token found')
    return ''
  }

  try {
    console.log('Starting image generation for prompt:', prompt)
    console.log('Using model:', model)

    const start = await axios.post(
      '/api/replicate/v1/predictions',
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
      return ''
    }

    let status = start.data.status
    let output = start.data.output

    console.log('Initial status:', status)

    while (status !== 'succeeded' && status !== 'failed' && status !== 'canceled') {
      await new Promise(r => setTimeout(r, 2000))

      try {
        const poll = await axios.get(`/api/replicate/v1/predictions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        status = poll.data.status
        output = poll.data.output

        console.log('Polling status:', status, 'Output:', output)

        if (status === 'failed') {
          console.error('Prediction failed:', poll.data.error)
          return ''
        }

      } catch (pollError) {
        console.error('Error polling prediction:', pollError)
        return ''
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
    return ''

  } catch (error: any) {
    console.error('Image generation failed:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    console.error('Error message:', error.message)

    // Fallback: return a fitness-themed placeholder image URL
    console.log('Returning placeholder image due to API failure')
    let placeholderText = 'Fitness Image'
    let bgColor = '6366f1' // Default blue

    return `https://dummyimage.com/400x300/${bgColor}/ffffff?text=${encodeURIComponent(prompt)}`
  }
}
