// svgファイルの型定義を上書きする。
// tsconfig.jsonの`include`で、`next-env.d.ts`より前にこのファイルを配置すること。
//
// https://zenn.dev/luvmini511/articles/e446a8bb674ce9
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>;

  export default content;
}
