import Service from '../models/ServiceSchema.js';

export const getServicesByIds = async (req, res) => {
    try {
        const { ids } = req.body;
        const services = await Service.find({ _id: { $in: ids } });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania usług', error });
    }
};