import { large_json_message, large_passage_message } from "./contant";
import { SinglestoreService } from "./db/SinglestoreService";

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";

//read the data from the standard input
process.stdin.on("data", (inputStdin) => {
  inputString += inputStdin;
});

// end of reading the standard input
process.stdin.on("end", () => {
  main();
});

async function main() {
  try {
    console.log(`pipeline input message: ${inputString}`);
    await handleCrudOperations(inputString);
  } catch (err) {
    console.error(`Failed to ingest data to singlestore db ${err}`);
  } finally {
    process.exit();
  }
}

async function handleCrudOperations(message) {
  const singlestoreService = new SinglestoreService();
  const smallText = { id: 1342, phone: "8329433232", name: "adfd" };
  const smallJsonVar = {
    id: 323,
    name: "John",
    dateOfBirth: new Date(),
  };
  const smallPassage =
    "MSH|^~&|MESA_ADT|XYZ_ADMITTING|iFW|ZYX_HOSPITAL|||ADT^A04|103102|P|2.4||||||||\nEVN||200007010800||||200007010800";
  console.log("--- Performing crud operations");
  await singlestoreService.setConnection();
  await singlestoreService.readSmallMessagesById(34);
  await singlestoreService.readJsonMessages();
  await singlestoreService.readPassageMessages();
  await singlestoreService.readLargePassageMessages();

  // comment below line for viewing above messages in terminal, if the terminal fillout
  // await singlestoreService.readLargeJsonMessages();

  await singlestoreService.writeTosmall_messages(smallText);
  await singlestoreService.writeTojson_messages(smallJsonVar);
  await singlestoreService.writeTopassage_messages(smallPassage);
  await singlestoreService.writeTolarge_passage_messages(large_passage_message);
  await singlestoreService.writeTolarge_json_messages(large_json_message);
}
