# Tour de App - Nominační/Soutěžní kolo - Team Kapibara
Aplikace pro spojení lektorů a studentů

----
## Instruction on how to run the app

1. clone the repositary
```bash 
git clone https://github.com/kekugesso/TdA24-Kapibara
```
2. navigate to the repositary
```bash 
cd TdA24-Kapibara
```
3. build the docker image

```bash 
docker build -t appka .
```
3.1 or build and run and exit the app with one command 
```bash 
docker build -t appka . && container_id=$(docker run -dp 127.0.0.1:5000:80 appka | cut -c1-12) && echo "Container ID: $container_id" && (trap 'docker kill $container_id' EXIT; docker logs -f --details $container_id)
```

4. run the docker app
```bash 
docker run -dp 127.0.0.1:80:5000 appka
```
4.1 or run the app with logs follow
```bash 
container_id=$(docker run -dp 127.0.0.1:80:5000 | cut -c1-12) && echo "Container ID: $container_id" && docker logs -f --details $container_id
```
6. navigate to the app: 
    [127.0.0.1:5000](127.0.0.1:5000)
