const commonQuery = (model: any) => {
  return {
    // ✅ CREATE new record
    async create(data: Record<string, any>) {
      try {
        const createdItem = await model.create(data);
        return createdItem;
      } catch (error) {
        throw error;
      }
    },

    // ✅ GET ALL records
    async getAll(options: any = {}) {
      try {
        const items = await model.findAll(options);
        return items;
      } catch (error) {
        throw error;
      }
    },

    // ✅ GET ONE record by filter
    async getOne(filter: Record<string, any> = {}) {
      try {
        const item = await model.findOne({ where: filter });
        return item;
      } catch (error) {
        throw error;
      }
    },

    // ✅ GET BY PRIMARY KEY (usually ID)
    async getById(id: number | string) {
      try {
        const item = await model.findByPk(id);
        return item;
      } catch (error) {
        throw error;
      }
    },

    // ✅ DELETE BY PRIMARY KEY
    async deleteById(id: number | string) {
      try {
        const deletedCount = await model.destroy({ where: { id } });
        return deletedCount; // returns number of rows deleted
      } catch (error) {
        throw error;
      }
    },

    // ✅ UPDATE by filter
    async update(
      filter: Record<string, any>,
      data: Record<string, any>
    ) {
      try {
        const [affectedCount, affectedRows] = await model.update(data, {
          where: filter,
          returning: true, // PostgreSQL only; MySQL will not return updated rows
        });
        return { affectedCount, affectedRows }; // rows won't be populated in MySQL
      } catch (error) {
        throw error;
      }
    },
  };
};

export default commonQuery;
