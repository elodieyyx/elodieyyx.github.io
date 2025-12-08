import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;
