import Header from "../components/Header";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";

import styles from "../css/Container.module.css";

const Container = () => {

    return (
        <div className={styles.container}>
            <Header />
            <MainContent />
            <Footer />
        </div>
    )
}

export default Container;