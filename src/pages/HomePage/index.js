import { motion } from 'framer-motion';
import FaceApiVideo from '../../components/FaceApi/faceapivideo';
import BoardGraph from '../../components/BoardGraph';
import Carrosel from '../../components/Carousel';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';
import { useServices } from '../../providers/Services';
import { Container } from './styles';

// -----------------------------------------
const HomePage = () => {
    const { auth } = useServices();

    return (
        <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.7 }}
            transition={{ duration: 0.5 }}
        >
            <TopBar />
            <Container>
                <FaceApiVideo />
                <BoardGraph />
                {auth && <Carrosel />}
            </Container>
            <Footer />
        </motion.div>
    );
};

export default HomePage;
