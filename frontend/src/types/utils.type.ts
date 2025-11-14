
import { paths } from "./api";
import { components } from "./api";

type TypeResponse<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath] = "post"
> =
  paths[TPath][TMethod] extends {
    responses: {
      200: {
        content: {
          "application/json": infer R;
        };
      };
    };
  }
    ? R
    : never;
;

type TypeRequest<TName extends keyof components["schemas"]> =
    components["schemas"][TName];


export type { TypeResponse, TypeRequest };
