import axios from "axios"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" })
  }

  try {
    const start = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "black-forest-labs/flux-1.1-pro",
        input: {
          prompt,
          width: 1024,
          height: 1024,
          num_inference_steps: 25,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VITE_REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )

    const id = start.data.id

    let status = start.data.status
    let output = null

    while (!["succeeded", "failed", "canceled"].includes(status)) {
      await new Promise(r => setTimeout(r, 2000))

      const poll = await axios.get(
        `https://api.replicate.com/v1/predictions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      )

      status = poll.data.status
      output = poll.data.output
    }

    if (status !== "succeeded") {
      return res.status(500).json({ error: "Image generation failed" })
    }

    return res.status(200).json({
      image: Array.isArray(output) ? output[0] : output,
    })
  } catch (err) {
    console.error(err.response?.data || err.message)
    return res.status(500).json({ error: "Internal error" })
  }
}