import { DotLoader } from "halogenium";
import { FC } from "react"

type Props = {
  isLoading: boolean
}
export const Loading: FC<Props> = ({isLoading}) => {
  const className = isLoading ? 'loading' : '';
  const overlay = isLoading ? 'overlay' : '';
  return <div className={overlay}>
    <div className={className}>
      {isLoading ? <DotLoader color="#45A1FF" /> : null}
    </div>
  </div>;
}
