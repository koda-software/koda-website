import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center gap-4 px-6">
      <p className="text-sm font-medium text-fd-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-normal">Page not found</h1>
      <p className="text-fd-muted-foreground">
        The requested documentation page does not exist.
      </p>
      <Link href="/docs/en" className="text-sm font-medium text-fd-primary">
        Open documentation
      </Link>
    </main>
  );
}
