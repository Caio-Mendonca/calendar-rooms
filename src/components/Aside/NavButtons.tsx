import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Svg from '@/Images'
import { Asset } from '@/Images'

export default function NavButtons() {
  const router = useRouter()
  const path = router.pathname



  return <>
      <Link href={'/'}>

      <span
        className={classNames(
          'group mt-2 flex w-full cursor-pointer items-center justify-start gap-x-3 rounded-lg p-3 transition-colors hover:bg-navHover',
          path ==='/'?  'bg-navHover': ''
        )}
      >
        <div style={{ minWidth: '26px' }} className="flex items-center">
          <Svg name={Asset.Calendar} width={24} height={24} alt={'Agenda Deolinda'} />
        </div>
          <a className={'menu-hide'}>
            <small className="font-medium">Agenda Deolinda</small>
          </a>
        
      </span>
      </Link>
      <Link href={'/2'}>
      <span
        className={classNames(
          'group mt-2 flex w-full cursor-pointer items-center justify-start gap-x-3 rounded-lg p-3 transition-colors hover:bg-navHover',
          path ==='/2'?  'bg-navHover': ''
        )}
      >
        <div style={{ minWidth: '26px' }} className="flex items-center">
          <Svg name={Asset.Calendar} width={24} height={24} alt={'Agenda José Mauricio'} />
        </div>
        
          <a className={'menu-hide'}>
            <small className="font-medium">Agenda José Mauricio</small>
          </a>
        
      </span>
      </Link>
  </>
}
