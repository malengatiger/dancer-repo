echo "🍎 🍎 🍎 Build Docker image and Deploy AftaRobot Backend ............."
echo "🎽 🎽 compile the code with tsc  🎽 🎽"
tsc
echo "🎽 🎽 builds submit: starting to build image  🎽 🎽"
gcloud builds submit --tag gcr.io/taxiyam-2021/arwebapi

echo "🎽 🎽 beta run deploy: ... starting ....  🎽 🎽"
gcloud beta run deploy arwebapi --image gcr.io/taxiyam-2021/arwebapi --platform managed

echo "🍎 🍎 🍎 End of AftaRobot Deploymnet on Google Cloud Platform.  🍐 YEBO GOGO!!  🍐"