/* eslint-disable @next/next/no-img-element */
import type { ComponentProps } from "react";

export default function MarkdownImage(props: ComponentProps<"img">) {
  return <img {...props} alt={props.alt ?? ""} loading="lazy" decoding="async" />;
}
