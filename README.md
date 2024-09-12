# Simple test to use Sealed Secrets
**Requirements:** The Bitnami Sealed secrets cluster-side controller. The Bitnami Sealed secrets client-side utility `kubeseal`. https://github.com/bitnami-labs/sealed-secrets

You also need the `kubectl` or `oc` cli.

## If Sealed Secrets is not installed on the cluster 
You can install the Bitnami Sealed secrets cluster-side controller using `helm`.

```bash
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
helm repo update
helm install sealed-secrets -n kube-system --set-string fullnameOverride=sealed-secrets-controller sealed-secrets/sealed-secrets
```
This will install the the Bitnami Sealed secrets cluster-side controller in the `kube-system` namespace and overrides the controller name, default set to `sealed-secrets` by the `helm chart`. The `kubeseal` utillity tries to access the controller with the name `sealed-secrets-controller`.
With this you don't have to pass `--controller-name=sealed-secrets-controller` and `--controller-namespace=kube-system` when using the `kubeseal` utillity.

## To create a `sealed secret`
If you are connected to the cluster:
```bash
oc create secret generic mysecret --dry-run=client -o yaml --from-literal=user=myuserid --from-literal=password=mypassword | kubeseal --format yaml > mysealedsecret.yaml
```
If you are NOT connected to the cluster, you can pass the `public certificate`to the command:
```bash
oc create secret generic mysecret --dry-run=client -o yaml --from-literal=user=myuserid --from-literal=password=mypassword | kubeseal --cert sealcert-pub.pem --format yaml > mysealedsecret.yaml
```
To retrieve the `public certificate`and store it locally:
```bash
oc  --controller-namespace=kube-system --fetch-cert > sealcert-pub.pem
```
Note. When using windows - you probably have to convert the `public certificate`retrieved from the controller to utf-8

The `sealed secret`is safe to commit to `git`.

## Apply the `sealed secret`to the openshift project
From local file:
```bash
oc create -f mysealedsecret.yaml
```
From `git`:
```bash
oc create -f https://github.com/<path-to>/mysealedsecret.yaml
```
Note. When using windows - you probably have to convert the `sealed secret`to utf-8 when storing in `git`.


## Create application in Openshift project xxx
Using the OpenShift web console as Developer:
Add from Git Repository
- add the git repo url: https://github.com/rikalm66/hello-world-node.git
- name: sealed-secret-test
- wait for the build to complete
- the volume is not defined in the deployment..
- edit the `Deployment yaml`and
	add the below under `protocol: TCP`
```bash
          volumeMounts:
            - name: secret-volume
              mountPath: /etc/secret-volume
      volumes:
        - name: secret-volume
          secret:
            secretName: mysecret
```
- save the changes
- a new build will be initiated
- now the volume is defined and the secret should be available in the app
