from fastapi import FastAPI,APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
import openai
import os
from dotenv import load_dotenv
import json
# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=api_key)
app = FastAPI()
router = APIRouter(tags=['rescue chat'])

from supabase import create_client

# Initialize Supabase client
url = "https://pmkulkwvpqrfuuerzoda.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBta3Vsa3d2cHFyZnV1ZXJ6b2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExOTk0MjQsImV4cCI6MjA1Njc3NTQyNH0.PzO6OHFxzyHvTLq2BhM45YancONoBOnXkCZZHr2EYjU"
supabase = create_client(url, key)

# Dummy dispatch functions
# Dummy dispatch functions
# geo_point:`POINT(${longitude} ${latitude})`,
def call_ambulance(latitude: float, longitude: float, description: str, case_type: str, priority: str, user_id: str):
    location = f"POINT({longitude} {latitude})"
    print(f"🚑 Dispatching ambulance to ({latitude}, {longitude})!")
    print(f"📄 Case Details: {description}")
    print(f"⚠️ Type: {case_type} | Priority: {priority}")

    # Insert into Supabase table
    data = {
        "latitude": latitude,
        "longitude": longitude,
        "description": description,
        "case_type": case_type,
        "priority": priority,
        "geo_point": location,
        "assigned_agency": "ambulance",
        "user_id": user_id
    }
    response = supabase.table("service_data").insert(data).execute()
    if response:
        print("✅ Data inserted successfully into Supabase.")
    else:
        print("❌ Failed to insert data into Supabase.")
    
    return f"Ambulance dispatched to ({latitude}, {longitude}) for {case_type} ({priority} priority). Description: {description}"

def call_police(latitude: float, longitude: float, description: str, case_type: str, priority: str, user_id: str):
    print(f"🚔 Dispatching police to ({latitude}, {longitude})!")
    print(f"📄 Case Details: {description}")
    print(f"⚠️ Type: {case_type} | Priority: {priority}")
    # Insert into Supabase table
    location = f"POINT({longitude} {latitude})"
    data = {
        "latitude": latitude,
        "longitude": longitude,
        "description": description,
        "case_type": case_type,
        "priority": priority,
        "geo_point": location,
        "assigned_agency": "police",
        "user_id": user_id
    }
    response = supabase.table("service_data").insert(data).execute()
    if response:
        print("✅ Data inserted successfully into Supabase.")
    else:
        print("❌ Failed to insert data into Supabase.")
    return f"Police dispatched to ({latitude}, {longitude}) for {case_type} ({priority} priority). Description: {description}"

def call_fire_department(latitude: float, longitude: float, description: str, case_type: str, priority: str, user_id: str):
    print(f"🔥 Dispatching fire department to ({latitude}, {longitude})!")
    print(f"📄 Case Details: {description}")
    print(f"⚠️ Type: {case_type} | Priority: {priority}")
    location = f"POINT({longitude} {latitude})"
    data = {
        "latitude": latitude,
        "longitude": longitude,
        "description": description,
        "case_type": case_type,
        "priority": priority,
        "geo_point": location,
        "assigned_agency": "fire_department",
        "user_id": user_id
    }
    response = supabase.table("service_data").insert(data).execute()

    if response:
        print("✅ Data inserted successfully into Supabase.")
    else:
        print("❌ Failed to insert data into Supabase.")

    return f"Fire department dispatched to ({latitude}, {longitude}) for {case_type} ({priority} priority). Description: {description}"

tools = [
    {
        "type": "function",
        "function": {
            "name": "call_ambulance",
            "description": "Call an ambulance in case of a medical emergency.",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {"type": "number", "description": "Latitude of the emergency location."},
                    "longitude": {"type": "number", "description": "Longitude of the emergency location."},
                    "description": {"type": "string", "description": "Short summary of the emergency case."},
                    "case_type": {"type": "string", "description": "Type of emergency, e.g., 'gunshot', 'stabbed', etc."},
                    "priority": {
                        "type": "string",
                        "enum": ["low", "medium", "high"],
                        "description": "Priority level of the emergency."
                    }
                },
                "required": ["latitude", "longitude", "description", "case_type", "priority"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "call_police",
            "description": "Call the police in case of a crime or security issue.",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {"type": "number", "description": "Latitude of the emergency location."},
                    "longitude": {"type": "number", "description": "Longitude of the emergency location."},
                    "description": {"type": "string", "description": "Short summary of the incident."},
                    "case_type": {"type": "string", "description": "Type of crime or security issue."},
                    "priority": {
                        "type": "string",
                        "enum": ["low", "medium", "high"],
                        "description": "Priority level of the emergency."
                    }
                },
                "required": ["latitude", "longitude", "description", "case_type", "priority"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "call_fire_department",
            "description": "Call the fire department in case of a fire emergency.",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {"type": "number", "description": "Latitude of the emergency location."},
                    "longitude": {"type": "number", "description": "Longitude of the emergency location."},
                    "description": {"type": "string", "description": "Short summary of the fire emergency."},
                    "case_type": {"type": "string", "description": "Type of fire emergency, e.g., 'building fire', 'forest fire'."},
                    "priority": {
                        "type": "string",
                        "enum": ["low", "medium", "high"],
                        "description": "Priority level of the fire emergency."
                    }
                },
                "required": ["latitude", "longitude", "description", "case_type", "priority"]
            }
        }
    }
]


# Initial system message
initial_system_message = {
    "role": "system",
    "content": [
        {
            "text": "Create an AI-powered emergency response assistant for handling 911 calls that utilizes tools for dispatching services and informing users, while engaging with users like a chatbot by asking relevant questions. The ultimate aim is to ensure that critical emergencies are prioritized, caller distress levels are accurately analyzed, and appropriate actions are recommended. Human operators must remain in control, reviewing every decision made by the AI to maintain efficiency and ensure life-saving decisions are primarily guided by human expertise.\n\n- **Tool Usage:** Use tools to dispatch emergency services as required and to provide users with pertinent information.\n- **Engagement:** Engage with the user in a conversational manner by asking questions to assess the situation and decide on the next steps as necessary.\n- **Decision Support:** Prioritize emergencies and analyze distress levels to recommend actions such as dispatching police, medical teams, or firefighters.\n- **Human Oversight:** Ensure all AI decisions and recommendations are reviewed and controlled by trained human professionals.\n\n# Steps\n\n1. **Initiate Interaction:** Begin by assessing the situation with introductory questions and gather necessary details from the caller.\n2. **Assess Emergency Priority:** Analyze the information provided by the user to determine the urgency and type of emergency.\n3. **Analyze Distress Levels:** Determine the distress level of the caller to prioritize response.\n4. **Recommend Actions:** Use AI tools to recommend actions or dispatch services based on priority and distress analysis.\n5. **Engage Human Oversight:** Ensure all decisions are cross-verified or managed by human operators to maintain safety and reliability.\n\n# Output Format\n\nRespond in a structured conversational format, ensuring clarity and relevance to the user's input. Use concise and straightforward language suitable for emergency situations.\n\n# Examples\n\n**Example 1:**\n\n- **Input:** User reports a fire in a building.\n- **AI Response:** \n  - Initiate: \"I understand there is a fire. Can you please tell me the exact location of the incident?\"\n  - Assess: \"Thank you. How many people are there with you, and is anyone in immediate danger?\"\n  - Recommend: (Upon determining the severity and location) \"I am dispatching the fire department to your location now. Please remain calm and ensure the area is evacuated.\"\n\n**Example 2:**\n\n- **Input:** User reports a potential burglary.\n- **AI Response:**\n  - Initiate: \"Can you tell me where this is happening?\"\n  - Assess: \"Are you or anyone else currently in danger?\"\n  - Recommend: (If confirmed as a priority situation) \"We are dispatching the police to assist you. Stay on the line and find a safe place.\"\n\n# Notes\n\n- Address any constraints that might affect the emergency services' deployment.\n- Tailor responses to ensure empathy and attentiveness to the user’s emotional state.\n- Highlight the importance of human oversight in validating all AI recommendations.",
            "type": "text"
        }
    ]
}


#either emotion / anxiety / fear check and dispatch as per needs
# initial_system_message = {
#     "role": "system",
#     "content": [
#         {
#             "text": '''You are a helpful 911 assistant trying to mitigate understaffing and rate the genuinely of user needs and decide on needful actions or whether human intervention is needed. You have to identify the user emotions from their response and if you sense anxiety or fear rate it out of 10 yourself and if you are provided with the  location and enough scenario and the anxiety or fear is greater than 8 then follow the following steps
# Tool Usage:* Use tools to dispatch emergency services as required and to provide users with pertinent information.
# - Engagement: Engage with the user in a conversational manner by asking questions to assess the situation and decide on the next steps as necessary.
# - Decision Support: Prioritize emergencies and analyze distress levels to recommend actions such as dispatching police, medical teams, or firefighters.
# - Human Oversight: Ensure all AI decisions and recommendations are reviewed and controlled by trained human professionals.

# 1. Initiate Interaction: Begin by assessing the situation with introductory questions and gather necessary details from the caller.
# 2. Assess Emergency Priority: Analyze the information provided by the user to determine the urgency and type of emergency.
# 3. Analyze Distress Levels: Determine the distress level of the caller to prioritize response.
# 4. Recommend Actions: Use AI tools to recommend actions or dispatch services based on priority and distress analysis.
# 5. Engage Human Oversight: Ensure all decisions are cross-verified or managed by human operators to maintain safety and reliability.

# It is also important to notice that if there is a response that doesn't even sound remotely like an emergency like user trying to order pizza it might be an emergency so makes sure to ask if they have an emergency and follow the right protocol''',
#             "type": "text"
#         }
#     ]
# }


class ChatHistory(BaseModel):
    history: Dict
    message: str
    user_id: str



@router.post("/chat/")
async def ai_chat(request: ChatHistory):
    history = request.history["messages"]
    
    if len(history) == 0:
        history.append(initial_system_message)

    history.append({"role": "user", "content": request.message})

    # Step 1: Ask OpenAI if a tool call is needed
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=history,
        tools=tools,
        tool_choice="auto",
        temperature=1,
        max_completion_tokens=200,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )

    ai_message = response.choices[0].message


    # Step 2: If AI message contains tool calls, execute them
    if ai_message.tool_calls:
        for tool_call in ai_message.tool_calls:
            function_name = tool_call.function.name
            arguments = json.loads(tool_call.function.arguments)  # Parse JSON string into a dictionary
            
            latitude = arguments.get("latitude")
            longitude = arguments.get("longitude")
            description = arguments.get("description")
            case_type = arguments.get("case_type")
            priority = arguments.get("priority")

            # Execute tool function with parameters
            if function_name == "call_ambulance":
                tool_result = call_ambulance(latitude, longitude, description, case_type, priority,request.user_id)
            elif function_name == "call_police":
                tool_result = call_police(latitude, longitude, description, case_type, priority,request.user_id)
            elif function_name == "call_fire_department":
                tool_result = call_fire_department(latitude, longitude, description, case_type, priority,request.user_id)
            else:
                tool_result = "Unknown tool call"

            # Correct way to append tool response
            history.append({
                "role": "system",
                "content": str(tool_result)
            })
            return {"messages": history}
    history.append(ai_message)  # Append AI message
    return {"messages": history}

