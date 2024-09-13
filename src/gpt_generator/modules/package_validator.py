
from gpt_generator.helpers.gpt_requests import create_chat_completion
from models.gpt_responses_interface import ArchitectorResponse
from helpers.config import config


async def package_validator(
    project: ArchitectorResponse,
    file_name: str,
    file_details: str
) -> str:
  try:
    prompt = f"""
    File Name: {file_name} \n
    File Details: {file_details}
    """

    content: str | None = None

    for worker in config.ai_config.workers:
      system_prompts = (
          (
              [config.ai_config.general_worker_system_prompt]
              if not worker.ignore_general_system_prompts
              else []
          )
          + worker.system_prompts
          + [])

      content = await create_chat_completion(
          worker.model,
          float(worker.temperature),
          system_prompts,
          ([content] if content != None else []) +
          [] + worker.assistant_prompts,
          [project.structure, prompt] + worker.user_prompts
      )

    print(f"{file_name} --------------------------------------- completed ---------------")
    return content or ""
  except Exception as e:
    print(f"An error occurred: {e}{__file__}")
    return str(e)
