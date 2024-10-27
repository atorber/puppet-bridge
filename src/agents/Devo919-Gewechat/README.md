## Win11中部署

1. 获取 WSL2 的内部 IP 地址

hostname -I

2. 在 WSL2 中运行服务并监听所有接口

python3 -m http.server 8000 --bind 0.0.0.0

3. 设置端口转发

使用 netsh 命令将 Windows 主机的端口转发到 WSL2 的端口。例如，将 Windows 的 8000 端口转发到 WSL2 的 8000 端口：

netsh interface portproxy add v4tov4 listenport=8000 listenaddress=0.0.0.0 connectport=8000 connectaddress=172.20.240.1
