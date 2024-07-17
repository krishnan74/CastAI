import { useWeb3Provider } from "@/context/Web3ModalContext";


export async function GET() {
  const { enablePersonality } = useWeb3Provider();

}
