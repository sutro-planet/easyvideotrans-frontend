## EasyVideoTrans Frontend
### 网址
[https://easyvideotrans.com/](https://easyvideotrans.com/)

### 技术栈
- 语言: [Typescript](https://www.typescriptlang.org/)
- 框架: [Next.js](https://nextjs.org/)
- 样式: [Tailwind CSS](https://tailwindcss.com/)
- 组件库: [Ant Design](https://ant.design/index-cn)
### 后端
- 后端项目参考: [EasyVideoTrans](https://github.com/sutro-planet/easyvideotrans)
- 后端地址通过Docker环境变量注入：```BACKEND_URL```

### 安装说明
#### 安装环境
**nvm**
参考 https://github.com/nvm-sh/nvm#install--update-script
**nodejs**
```bash
nvm install node
```
**pnpm**
参考 https://pnpm.io/installation
#### 依赖安装
```bash
pnpm install
```
#### BACKEND_URL开发设置
0.**此设置仅在开发阶段设置**

1.根目录创建```.env.local```文件

2.设置开发环境URL
```
BACKEND_URL=https://你的部署域名/api
```

#### 运行服务
```bash
pnpm dev
```
打开你的浏览器并访问 [http://localhost:3000](http://localhost:3000) 查看结果。

## 了解更多
要了解更多关于 Next.js 的信息，请参考以下资源：
- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的特性和 API。
- [学习 Next.js](https://nextjs.org/learn) - 一个交互式的 Next.js 教程。

你也可以查看 [Next.js GitHub 仓库](https://github.com/vercel/next.js/) - 欢迎提供反馈和贡献！

## 在 Vercel 上部署
部署你的 Next.js 应用的最简单方式是使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)，这个平台是 Next.js 的创建者提供的。

我们使用的是 [Docker部署](https://nextjs.org/docs/app/building-your-application/deploying#docker-image) 方案。

