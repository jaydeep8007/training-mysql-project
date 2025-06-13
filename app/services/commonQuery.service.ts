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

    // ✅ GET BY PRIMARY KEY with options
    async getById(id: number | string, options: Record<string, any> = {}) {
      try {
        const item = await model.findByPk(id, options);
        return item;
      } catch (error) {
        throw error;
      }
    },

    // ✅ DELETE by filter or primary key (no hardcoded messages)
async deleteById(
  filter: Record<string, any> | number | string,
  options: { returnDeleted?: boolean } = {}
) {
  try {
    const whereClause =
      typeof filter === "object" ? filter : { id: filter };

    // Check if the item exists before deletion
    const existingItem = await model.findOne({ where: whereClause });

    if (!existingItem) {
      return {
        deleted: false,
        deletedCount: 0,
      };
    }

    const deletedItem = options.returnDeleted ? existingItem : null;

    const deletedCount = await model.destroy({ where: whereClause });

    return {
      deleted: deletedCount > 0,
      deletedCount,
      deletedItem,
    };
  } catch (error) {
    throw error;
  }
},

    // ✅ UPDATE by filter (MySQL-compatible)
    async update(filter: Record<string, any>, data: Record<string, any>) {
      try {
        const [affectedCount] = await model.update(data, {
          where: filter,
        });

        // ✅ Fetch updated rows manually (optional)
        const updatedRows = await model.findAll({ where: filter });

        return { affectedCount, updatedRows };
      } catch (error) {
        throw error;
      }
    },
  };
};

export default commonQuery;
