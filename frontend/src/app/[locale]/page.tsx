import Image from "next/image";

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'pt' },
    { locale: 'es' },
  ];
}

export default function Home({ params }: { params: { locale: string } }) {
  return (
    <div>
      <h1>Current locale: {params.locale}</h1>
    </div>
  );
}
