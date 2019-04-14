// tslint:disable-next-line:typedef
const files = require.context(".", false, /\.ts$/);

const modules: any = {};

files.keys().forEach((key: string) => {
  // tslint:disable-next-line:no-console
  console.info(key);
  // if (key === "./index.ts") {
  //   return modules[key.replace(/(\.\/|\.ts)/g, "")] = files(key).default;
  // }
});

// files.keys().forEach(
//   // tslint:disable-next-line:typedef
//   function (key: string) {
//     if (key === "./index.ts") {
//       return modules[key.replace(/(\.\/|\.ts)/g, "")] = files(key).default;
//     }
//   }
// );

// 将当前目录下的所有.ts文件，放在modules中
export default modules;
