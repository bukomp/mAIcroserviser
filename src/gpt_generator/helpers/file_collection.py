
import asyncio
import logging
from gpt_generator.modules.worker import gpt_worker
from helpers.architecture_extractor import structure_2_dict
from helpers.code_extractor import extract_code

from models.file_interface import File, FileCollection
from models.gpt_responses_interface import ArchitectorResponse


async def a_create_file_collection(
        project: ArchitectorResponse,
        raw_architector_response: str) -> FileCollection:
  try:
    # Initialize FileCollection
    file_collection = FileCollection(project.name)

    architecture_file_string = f"""
    ## User Prompt ##


    ## File Structure ##
    {project.structure}

    ## Architecture Description ##
    {raw_architector_response}
    """

    # Add initial response to collection
    file_collection.collections["raw_responses"].append(
        File("architector.txt", architecture_file_string))

    structure_dictionary = structure_2_dict(project.structure)

    # Gather all coroutines for gpt_worker_async
    tasks: list[asyncio.Task] = []
    for file in project.files:
      task = asyncio.create_task(
          gpt_worker(project, file.file_name, file.description)
      )
      tasks.append(task)

    responses = await asyncio.gather(*tasks)

    # Add results to the collection
    for file, result in zip(project.files, responses):
      file_collection.collections["raw_responses"].append(
          File(f"raw_{file.file_name}.txt", result, "")
      )
      file_collection.collections["formatted_responses"].append(
          File(file.file_name, extract_code(result),
               structure_dictionary[file.file_name])
      )

    return file_collection

  except Exception as e:
    logging.error(f"An error occurred: {e}")
    return FileCollection("")
