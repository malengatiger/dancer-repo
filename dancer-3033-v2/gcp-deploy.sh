echo "🍎 🍎 🍎 Deploy TaxiYam Backend ............."
echo "Login to GCP using  🎽 gcloud auth login 🎽"

gcloud builds submit --tag gcr.io/taxiyam-2021/arwebapi
gcloud beta run deploy --image gcr.io/taxiyam-2021/arwebapi --platform managed

echo "🍎 🍎 🍎 End of TaxiYam Deploymnet on Google Cloud Platform.  🍐 YEBO GOGO!!  🍐"