import requests

API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"
headers = {
    "Authorization": f"Bearer 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"
}

data = {
    "inputs": "Who are you?",
    # You can add parameters here if needed
}

response = requests.post(API_URL, headers=headers, json=data)
print(response.json())