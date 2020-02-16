echo "🌼 🌼 🌼 🌼 Building AftaRobot Docker image ..."
docker build -t aftarobotregistry.azurecr.io/dancermx .
echo "🌼 🌼 🌼 🌼 Pushing AftaRobot Docker image ... to Azure"
docker push aftarobotregistry.azurecr.io/dancermx
echo "🌼 🌼 🌼 🌼  Finished. Done. 🌼 🌼 🌼 🌼 "
