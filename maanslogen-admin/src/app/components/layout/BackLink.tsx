import Link from "next/link";

export function BackLink({
  href,
  children,
  className = "",
  ...rest
}: {
  href: string;
  children: string;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      className={`text-heading-muted mb-4 inline-block text-sm hover:underline ${className}`.trim()}
      {...rest}
    >
      {children}
    </Link>
  );
}
