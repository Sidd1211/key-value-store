import axios from 'axios';
import { getOtherNodes } from './cluster.service.js';

const retryRequest = async (fn, retries = 2) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries - 1) throw err;
        }
    }
};

export const replicateData = async ({ key, value, operation }) => {
    const nodes = getOtherNodes();

    const requests = nodes.map(node => {
        return retryRequest(() =>
            axios({
                method: operation === 'DELETE' ? 'delete' : 'post',
                url: `${node}/kv${operation === 'DELETE' ? `/${key}` : ''}`,
                data: operation !== 'DELETE' ? { key, value } : {},
                headers: { 'x-replicated': 'true' },
                timeout: 1000
            })
        ).catch(err => {
            console.error(`Replication failed to ${node}`, err.message);
        });
    });

    await Promise.all(requests);
};