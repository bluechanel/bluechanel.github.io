---
title: 🐳 K8S+Rancher搭建
description: K8S 搭建
date: 2023-04-01
updateDate: 2024-06-15
tags: ["K8S","Rancher"]
cover:
    image: images/efa53000-b650-4171-804f-d2d7261ab846_2ddf433760e1dc69781e5d191b17121b.png
ShowToc: true
---

# 安装K8S

1. 修改主机名

    ```shell
    hostnamectl set-hostname kubemaster
    echo 172.16.0.22 kubemaster >> /etc/hostsg
    ```

2. 关闭selinux

    ```shell
    setenforce 0
    sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
    ```

3. 转发 IPv4 并让 iptables 看到桥接流量[文档](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/)

    ```shell
    cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
    overlay
    br_netfilter
    EOF
    
    sudo modprobe overlay
    sudo modprobe br_netfilter
    
    # 设置所需的 sysctl 参数，参数在重新启动后保持不变
    cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-iptables  = 1
    net.bridge.bridge-nf-call-ip6tables = 1
    net.ipv4.ip_forward                 = 1
    EOF
    
    # 应用 sysctl 参数而不重新启动
    sudo sysctl --system
    ```

4. 关闭交换区

    ```shell
    swapoff -a
    sed -e '/swap/s/^/#/g' -i /etc/fstab
    ```

5. 安装容器

    使用containerd，并修改配置


    ```sql
    dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    dnf install -y containerd.io
    
    mv /etc/containerd/config.toml /etc/containerd/config.toml.orig
    containerd config default > /etc/containerd/config.toml
    # 打开文件 修改SystemdCgroup为true
    vi /etc/containerd/config.toml
    [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
        SystemdCgroup = true
    # 配置开机启动，查看状态
    systemctl enable --now containerd.service
    systemctl status containerd.service
    ```


    使用docker


    ```shell
    dnf install -u docker-ce
    systemctl enable -now docker
    systemctl status docker
    VER=$(curl -s https://api.github.com/repos/Mirantis/cri-dockerd/releases/latest|grep tag_name | cut -d '"' -f 4|sed 's/v//g')
    echo $VER
    wget https://github.com/Mirantis/cri-dockerd/releases/download/v${VER}/cri-dockerd-${VER}.amd64.tgz
    tar xvf cri-dockerd-${VER}.amd64.tgz
    mv cri-dockerd/cri-dockerd /usr/local/bin/
    wget https://raw.githubusercontent.com/Mirantis/cri-dockerd/master/packaging/systemd/cri-docker.service
    wget https://raw.githubusercontent.com/Mirantis/cri-dockerd/master/packaging/systemd/cri-docker.socket
    sudo mv cri-docker.socket cri-docker.service /etc/systemd/system/
    sudo sed -i -e 's,/usr/bin/cri-dockerd,/usr/local/bin/cri-dockerd,' /etc/systemd/system/cri-docker.service
    sudo systemctl daemon-reload
    sudo systemctl enable cri-docker.service
    sudo systemctl enable --now cri-docker.socket
    ```

6. 防火墙端口开启

    ```shell
    firewall-cmd --permanent --add-port={6443,2379,2380,10250,10251,10252}/tcp
    firewall-cmd --reload
    ```

7. 配置k8s镜像源

    ```shell
    cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
    [kubernetes]
    name=Kubernetes
    baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
    enabled=1
    gpgcheck=1
    gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
    exclude=kubelet kubeadm kubectl
    EOF
    ```

8. 安装k8s，当前版本为1.27.1，根据官方文档，一般上一个版本1.26.3为稳定版本。如果要安装rancher，请对照rancher[支持的版本](https://artifacthub.io/packages/helm/rancher-stable/rancher#views)

    ```shell
    dnf install -y {kubelet,kubeadm,kubectl} --disableexcludes=kubernetes
    # 使用上一个版本
    dnf install -y kubelet-1.26.3 kubeadm-1.26.3 kubectl-1.26.3 --disableexcludes=kubernetes
    systemctl enable --now kubelet.service
    # 此时查看状态是启动错误
    systemctl status kubelet.service
    ```

9. 开启bash自动补全

    ```shell
    source <(kubectl completion bash)
    kubectl completion bash > /etc/bash_completion.d/kubectl
    ```

10. 使用阿里源下载容器镜像

    ```shell
    # 查看依赖镜像的版本，后续修镜像tag需要使用
    kubeadm config images list
    # contrainerd版本
    kubeadm config images pull --image-repository registry.cn-hangzhou.aliyuncs.com/google_containers
    # docker版本，指定crisocket版本
    kubeadm config images pull --image-repository registry.cn-hangzhou.aliyuncs.com/google_containers --cri-socket unix:///var/run/cri-dockerd.sock
    ```

11. 修改镜像tag，一共7个镜像

    ```shell
    # contrainerd版本
    ctr -n k8s.io image tag registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.9 registry.k8s.io/pause:3.9
    ctr -n k8s.io image tag registry.cn-hangzhou.aliyuncs.com/google_containers/coredns:v1.10.1 registry.k8s.io/coredns:v1.10.1
    ctr -n k8s.io image tag registry.cn-hangzhou.aliyuncs.com/google_containers/etcd:3.5.7-0 registry.k8s.io/etcd:3.5.7-0
    ctr -n k8s.io image tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.27.1 registry.k8s.io/kube-apiserver:v1.27.1
    ctr -n k8s.io image tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-controller-manager:v1.27.1 registry.k8s.io/kube-controller-manager:v1.27.1
    ctr -n k8s.io image tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-scheduler:v1.27.1 registry.k8s.io/kube-scheduler:v1.27.1
    ctr -n k8s.io image tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-proxy:v1.27.1 registry.k8s.io/kube-proxy:v1.27.1
    # docker版本，指定crisocket版本
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.26.4 k8s.gcr.io/kube-apiserver:v1.26.4
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-controller-manager:v1.26.4 k8s.gcr.io/kube-controller-manager:v1.26.4
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-scheduler:v1.26.4 k8s.gcr.io/kube-scheduler:v1.26.4
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-proxy:v1.26.4 k8s.gcr.io/kube-proxy:v1.26.4
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/coredns:v1.9.3 k8s.gcr.io/coredns:v1.9.3
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/etcd:3.5.6-0 k8s.gcr.io/etcd:3.5.6-0
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.9 k8s.gcr.io/pause:3.9
    
    
    docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.26.4
    docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/kube-controller-manager:v1.26.4
    docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/kube-scheduler:v1.26.4
    docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/kube-proxy:v1.26.4
    docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/coredns:v1.9.3
    docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/etcd:3.5.6-0
    docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.9
    ```

12. 安装CNI插件

    containerd版


    ```shell
    mkdir /opt/bin
    curl -fsSLo /opt/bin/flanneld https://github.com/flannel-io/flannel/releases/download/v0.20.1/flannel-v0.20.1-linux-amd64.tar.gz
    chmod +x /opt/bin/flanneld
    ```


    添加[CNI配置文件](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/#about-the-incompatible-cni-versions-and-failed-to-destroy-network-for-sandbox-errors)


    ```shell
    cat << EOF | tee /etc/cni/net.d/10-containerd-net.conflist
    {
     "cniVersion": "1.0.0",
     "name": "containerd-net",
     "plugins": [
       {
         "type": "bridge",
         "bridge": "cni0",
         "isGateway": true,
         "ipMasq": true,
         "promiscMode": true,
         "ipam": {
           "type": "host-local",
           "ranges": [
             [{
               "subnet": "10.88.0.0/16"
             }],
             [{
               "subnet": "2001:db8:4860::/64"
             }]
           ],
           "routes": [
             { "dst": "0.0.0.0/0" },
             { "dst": "::/0" }
           ]
         }
       },
       {
         "type": "portmap",
         "capabilities": {"portMappings": true},
         "externalSetMarkChain": "KUBE-MARK-MASQ"
       }
     ]
    }
    EOF
    ```


    docker版本


    ```shell
    vi /etc/systemd/system/cri-docker.service
    # 修改下面的配置
    ExecStart=/usr/local/bin/cri-dockerd --network-plugin cni --container-runtime-endpoint fd://
    
    systemctl daemon-reload
    systemctl restart cri-docker
    
    cat << EOF > 01-cri-dockerd.json
    {
      "cniVersion": "0.4.0",
      "name": "dbnet",
      "type": "bridge",
      "bridge": "cni0",
      "ipam": {
        "type": "host-local",
        "subnet": "10.1.0.0/16",
        "gateway": "10.1.0.1"
      }
    }
    EOF
    ```

13. 初始化

    ```shell
    kubeadm init --image-repository registry.cn-hangzhou.aliyuncs.com/google_containers
    # docker版本
    kubeadm init --image-repository registry.cn-hangzhou.aliyuncs.com/google_containers --cri-socket unix:///var/run/cri-dockerd.sock
    ```


    初始化失败，查看日志


    错误1：`failed to pull image \"`[`registry.k8s.io/pause:3.6\`](http://registry.k8s.io/pause:3.6%5C)`": failed to pull and unpack image \"`[`registry.k8s.io/pause:3.6\`](http://registry.k8s.io/pause:3.6%5C)`"`


    原因：虽然命令行提供的pause是3.9版本，但实际初始化过程中需要的是3.6版本，默认是去google云获取镜像，国内无法访问，导致错误


    解决方法：


    自行下载3.6 并修改tag


    ```shell
    # contrainerd版本
    ctr -n k8s.io image pull registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.6
    ctr -n k8s.io image tag registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.6 registry.k8s.io/pause:3.6
    # docker 版本
    docker image pull registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.6
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.6 registry.k8s.io/pause:3.6
    ```


    重置初始化`kubeadm reset`后，重新执行初始化命令，成功


    ![Untitled.png](images/efa53000-b650-4171-804f-d2d7261ab846_ccdf8d5815d6e2434d6bf9c3df1b8349.png)


    此命令为子节点加入命令，请保存

14. 完成

    根据提示，配置以下内容


    ```shell
    mkdir -p $HOME/.kube
    cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    chown $(id -u):$(id -g) $HOME/.kube/config
    echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> /etc/profile.d/k8s.sh
    ```


    查看节点信息`kubectl get nodes`


    查看集群信息`kubectl cluster-info`


    配置pod网络插件


    ```shell
    kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
    ```


    查看所有pod信息`kubectl get pods --all-namespaces`


## 常用操作命令


```shell
# 部署应用
kubectl apply -f app.yaml
# 查看deployment
kubectl get deployment
# 查看pod
kubectl get pod -o wide
# 查看pod详情
kubectl describe pod pod-name
# 查看log
kubectl logs pod-name
# 进入pod终端
kubectl exec -it pod-name --bash
# 指定进入的容器
kubectl exec -it pod-name -c container-name -- bash
# 伸缩扩展副本
kubectl scale deployment test-k8s --replicas=5
# 把集群内端口映射到节点
kubectl port-forword pod-name 8090:8080
# 查看历史
kubectl rollout history deployment test-k8s
# 回到上个版本
kubectl rollout undo deployment test-k8s
# 回到指定版本
kubectl rollout undo deployment test-k8s --to-revision=2
# 删除部署
kubectl delete deployment test-k8s
```


# 安装Rancher

1. 安装helm

    ```shell
    wget https://github.com/helm/helm/releases/download/v3.11.3/helm-v3.0.0-linux-amd64.tar.gz
    tar -zxvf helm-v3.0.0-linux-amd64.tar.gz
    mv linux-amd64/helm /usr/local/bin/helm
    ```

2. 添加helm chart仓库

    ```shell
    helm repo add rancher-stable https://releases.rancher.com/server-charts/stable
    # 创建命名空间
    kubectl create namespace cattle-system
    ```

3. 生成自签名证书，[脚本参考](https://docs.rancher.cn/docs/rancher2.5/installation/resources/advanced/self-signed-ssl/_index/#41-%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90-ssl-%E8%87%AA%E7%AD%BE%E5%90%8D%E8%AF%81%E4%B9%A6%E8%84%9A%E6%9C%AC)，参考后续验证证书

    ```shell
    # 如果无域名可以不填写--ssl-domain参数
    ./create_self-signed-cert.sh --ssl-size=2048 --ssl-date=3650
    # 验证后 请添加TLS密文
    #创建ingress密钥
    kubectl -n cattle-system create secret tls tls-rancher-ingress --cert=./tls.crt --key=./tls.key
    
    #创建证书密钥
    kubectl -n cattle-system create secret generic tls-ca --from-file=./cacerts.pem
    ```

4. 安装rancher，配置参考[文档](https://ranchermanager.docs.rancher.com/zh/v2.6/pages-for-subheaders/install-upgrade-on-a-kubernetes-cluster#5-%E6%A0%B9%E6%8D%AE%E4%BD%A0%E9%80%89%E6%8B%A9%E7%9A%84%E8%AF%81%E4%B9%A6%E9%80%89%E9%A1%B9%E9%80%9A%E8%BF%87-helm-%E5%AE%89%E8%A3%85-rancher)

    ```shell
    helm install rancher rancher-stable/rancher \
      --namespace cattle-system \
      --set bootstrapPassword=admin \
      --set ingress.tls.source=secret \
      --set replicas=1 \
    # 出错，需要卸载请执行
    # helm uninstall rancher rancher-stable/rancher --namespace cattle-system
    ```


5. 检查安装


    ```shell
    kubectl -n cattle-system rollout status deploy/rancher
    Waiting for deployment "rancher" rollout to finish: 0 of 3 updated replicas are available...
    deployment "rancher" successfully rolled out
    ```


    ```shell
    kubectl -n cattle-system get deploy rancher
    NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    rancher   3         3         3            3           3m
    ```

1. 编辑配置文件

    ```shell
    kubectl -n cattle-system edit service rancher
    ```

2. 修改 `type: ClusterIP`为 `type: NodePort`

    ```shell
    spec:
    type: NodePort
    ports:  
    - name: http
    port: 443
    targetPort: 444
    nodePort: 30409
    ```

3. 查看分配的端口地址为30777和30409

    ```shell
    kubectl -n cattle-system get service rancher
    NAME      TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
    rancher   NodePort   10.102.224.3   <none>        80:30777/TCP,443:30409/TCP   8m1s
    ```

4. 查看初始密码

    ```shell
    kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}{{ "\n" }}'
    ```

5. 访问https://172.16.0.22:30409登录即可
6. 卸载rancher [文档](https://github.com/rancher/rancher-cleanup)

    ```shell
    kubectl create -f deploy/rancher-cleanup.yaml
    # 查看卸载日志
    kubectl  -n kube-system logs -l job-name=cleanup-job  -f
    ```


# 异常处理

1. 使用`kubectl -n namespace describe pod`查看pod信息，events报错`0/1 nodes are available: 1 node(s) had untolerated taint {`[`node-role.kubernetes.io/control-plane:`](http://node-role.kubernetes.io/control-plane:) `}. preemption: 0/1 nodes are available: 1 Preemption is not helpful for scheduling.`

    原因：由于是单节点部署，而默认主节点[node-role.kubernetes.io/control-plane](http://node-role.kubernetes.io/control-plane:)不允许被调度


    修复方式：允许节点被调度`kubectl taint nodes --all` [`node-role.kubernetes.io/control-plane`](http://node-role.kubernetes.io/control-plane)`-`


    扩展：`kubectl taint nodes --all` [`node-role.kubernetes.io/control-plane`](http://node-role.kubernetes.io/control-plane)`=:NoSchedule`

    - NoSchedule: 一定不能被调度
    - PreferNoSchedule: 尽量不要调度
    - NoExecute: 不仅不会调度, 还会驱逐Node上已有的Pod
2. `systemctl enable cri-docker.service/cri-docker.socket`报错Failed to enable unit: Unit file `cri-docker.service/cri-docker.socket` does not exist.

    原因：SELinux配置信息问题


    修复方式：使用`restorecon`命令用来恢复SELinux文件属性即恢复文件的安全上下文。


    ```shell
    restorecon /etc/systemd/system/cri-docker.service
    systemctl enable cri-docker.service
    Created symlink /etc/systemd/system/multi-user.target.wants/cri-docker.service → /etc/systemd/system/cri-docker.service.
     
    restorecon /etc/systemd/system/cri-docker.socket
    systemctl enable cri-docker.socket
    Created symlink /etc/systemd/system/sockets.target.wants/cri-docker.socket → /etc/systemd/system/cri-docker.socket.
    systemctl start cri-docker
    ```

