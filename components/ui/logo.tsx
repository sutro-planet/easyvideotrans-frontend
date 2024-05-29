import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="block" aria-label="Cruip">
      <Image
        src={'/img/logo.jpg'}
        width={400}
        height={400}
        alt={'Pytvzhen Logo'}
        className={'h-8 w-8 rounded-full'}
      ></Image>
    </Link>
  );
}
