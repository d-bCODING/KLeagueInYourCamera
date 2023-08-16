import Header from './part/Header';
import { useRecoilValue } from "recoil";
import { isLoginAtom } from '../atoms';


function MainPage() {
    const isLogin = useRecoilValue(isLoginAtom);
    return (
        <>
            <Header isLogin = {isLogin}></Header>
        </>
    );
}

export default MainPage;