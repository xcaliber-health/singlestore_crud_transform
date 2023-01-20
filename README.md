## Run the application local

setup

`npm i`

Update database info in src/db/SinglestoreService file

Test in local

`echo "random input message" | npm start`

## Run on the singlestore VM

Application is present in /home/ec2-user/pipeline2_transform

Run steps present in the app)build_setup.sh or follow below steps

Run npm i

`npm install``

Update the code in the files and build the app

`npm run build`

Copy the dist folder to after running the build

`sudo cp -r ~/pipeline_transform/dist /etc/memsql/test_convert_hl7_fhir/`

Copy node_modules

`sudo cp -r ~/pipeline_transform/node_modules /etc/memsql/test_convert_hl7_fhir/`

Copy executable.sh

`sudo cp -r ~/pipeline_transform/executable.sh /etc/memsql/test_convert_hl7_fhir/`

```

```
