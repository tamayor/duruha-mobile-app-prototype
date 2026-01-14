import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div className='flex flex-col gap-4 justify-center items-center h-screen'>
      <a href="/farmer">Farmer</a>
      <a href="/consumer">Consumer</a>
    </div>
  )
}
