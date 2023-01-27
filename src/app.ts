import { large_json_message, large_passage_message } from "./contant";
import { SinglestoreService } from "./db/SinglestoreService";

const converter = require("@xcaliber-health/fhir-converter/src/converter");

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";
let currentLine = 0;
let uuids = [];

function splitLines(t) { return t.split(/\r\n|\r|\n/); }

//read the data from the standard input
process.stdin.on("data", (inputStdin) => {
  inputString += inputStdin;
  inputString = inputString.trim();
  //console.log(splitLines(inputString));
  uuids = splitLines(inputString);
});

// end of reading the standard input
process.stdin.on("end", () => {
  main();
});

async function main() {
  try {
    console.log(`pipeline input message: ${inputString}`);
   // await handleCrudOperations(inputString);
    await kafkaFHIRTransform(inputString);
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
  await singlestoreService.writeTojson_messages(JSON.stringify(smallJsonVar));
  await singlestoreService.writeTopassage_messages(smallPassage);
  await singlestoreService.writeTolarge_passage_messages(large_passage_message);
 // await singlestoreService.writeTolarge_json_messages(large_json_message);
}

async function kafkaFHIRTransform(inputString) {
  try {
    const singlestoreService = new SinglestoreService();
    await singlestoreService.setConnection();
  
    for (let i=0; i<uuids.length; i++) {
        uuids[i] = uuids[i].replace(/%/g,'');
        let hl7message = await singlestoreService.readPassageMessagesById(uuids[i]);

        const segments = hl7message.split("\r");
        segments[0] = "MSH" + segments[0].split("&").join("\\&");
        hl7message = segments.join("\n");
  
        // console.log(`${inputString} read from db:----` + hl7message);
 
        const convertedMsg = await converter.convertHL7v2ToFHIR(hl7message);
        // console.log(`${inputString} conveted----`, convertedMsg);

        if (convertedMsg.status === 200) {
        //    console.log(`${inputString} update----`);
           const fhirBundle = convertedMsg.resultMsg.fhirResource;
          // console.log(JSON.stringify(fhirBundle));
          await singlestoreService.writeTolarge_passage_messages(JSON.stringify(fhirBundle));
      } else {
        singlestoreService.closeConnection();
        throw new Error(`Error: HL7 Conversion failed`);
        }
    }
    singlestoreService.closeConnection();
  } catch (err) {
  console.error(`Failed to ingest data to singlestore db ${err}`);
  }
 process.exit();
}