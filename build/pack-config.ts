import { Configuration } from "electron-builder";
import { PackOptions } from "./pack";

export function generateConfig(options: PackOptions): Configuration {
  const { releaseName, releaseNotes } = options

  return {
    // 应用id，不同平台有不同的规则建议
    // MacOS： https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102070
    // Windows： https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-lcid/a9eac961-e77d-41a6-90a5-ce1a8b0cdb9c?redirectedfrom=MSDN
    appId: "com.my-app",
    // 应用名称
    productName: "My App",
    // 版权信息
    copyright: "Copyright © 2020 ${author}",
  
    directories: {
      // 构建资源文件目录，不会打包到app中，如果需要打包其中的一些文件比如托盘图标，需要在files字段中指定，比如 `"files": ["**/*", "build/icon.*"]`
      buildResources: "resources",
      // 打包输出目录
      output: "release/${version}",
      // 包含package.json的应用目录，默认会读取 `app`, `www`, 或当前工作目录，通常不用指定
      app: ".",
    },
  
    // 默认读取package.json中的version，可不添加
    buildVersion: "1.0.0",
    // 打包出的app文件名称，可以通过变量指定，比如这个配置打包后名称可能为`Electron Builder-1.0.0-latest.dmg`
    artifactName: "${productName}-${version}-${channel}.${ext}",
    // 指定需要复制过去打包的文件，https://www.electron.build/configuration/contents#files
    files: ["output", "resources", "!node_modules"],
    // 是否打包成asar档案文件, https://www.electronjs.org/docs/tutorial/application-packaging
    asar: false,
  
    // 在签名没有成功时打包程序会失败退出，在各平台的签名设置都配置好之后建议启用
    forceCodeSigning: false,
    // 发布选项，和更新服务器类型相关，这里我们选择generic， https://www.electron.build/configuration/publish
    publish: [
      {
        provider: "generic",
        // 更新服务器地址
        url: '',
        // 默认为latest，也可以手动指定alpha，beta等
        channel: "latest",
      },
    ],
    // 发布信息
    releaseInfo: {
      releaseName,
      releaseNotes,
    },
  
    mac: {
      target: ["dmg", "zip"],
      icon: "resources/icon.icns",
      // 应用的分类，可选的分类参考文档：https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
      category: "public.app-category.developer-tools",
      // 管理macOS应用程序的安全保护和资源访问。https://developer.apple.com/documentation/security/hardened_runtime
      hardenedRuntime: true,
      // Key-value pairs that grant an executable permission to use a service or technology.
      // https://developer.apple.com/documentation/bundleresources/entitlements
      // https://developer.apple.com/documentation/security/hardened_runtime
      entitlements: "resources/entitlements.mac.plist",
      // Info.plist的额外条目。https://developer.apple.com/documentation/bundleresources/information_property_list
      extendInfo: {
        NSMicrophoneUsageDescription: "请允许访问您的麦克风",
        NSCameraUsageDescription: "请允许访问您的摄像头",
      },
    },
  
    dmg: {
      // 配置安装窗口大小和背景图，图标和图标文字大小等
      // background: "resources/background.jpg",
      iconSize: 128,
      iconTextSize: 13,
      // window: {
      //   width: 900,
      //   height: 563,
      // },
    },
  
    win: {
      target: [
        {
          target: "nsis",
          arch: ["x64", "ia32"],
        },
      ],
      icon: "resources/icon.ico",
    },
  
    nsis: {
      oneClick: false,
      perMachine: false,
      allowElevation: true,
      allowToChangeInstallationDirectory: true,
      // 最终用户许可协议，如果需要请编辑后使用
      // license: "resources/eula.txt",
      deleteAppDataOnUninstall: false,
      displayLanguageSelector: false,
    },
  };
}
