Guide from (https://docs.traefik.io/user-guides/crd-acme/)

`kubectl apply -f XX-filename.yml` in order.

Need to run this command before `04`:
```
kubectl port-forward --address 0.0.0.0 service/traefik 8000:8000 8080:8080 443:4443 -n default
```
