import { DataTypes, Model, Optional } from 'sequelize';
import Joi from 'joi';

import { sequelize } from '../startup/database';

interface NoteAttributes {
  noteId: string;
  userId: string;
  attachment: string;
  content: string;
}

// 'noteId' property declared optional as auto created.
//
interface NoteCreationAttributes extends Optional<NoteAttributes, 'noteId'> {}

interface NoteInstance extends Model<NoteAttributes, NoteCreationAttributes>, NoteAttributes {
  createdAt?: Date;
}

export const Note = sequelize.define<NoteInstance>('note', {
  noteId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  attachment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export const validate = (values: any) => {
  const schema = Joi.object({
    userId: Joi.number().integer().required(),
    content: Joi.string().min(1).max(1024).required(),
    attachment: Joi.string().min(1).max(255),
  });
  const result = schema.validate(values, { abortEarly: false });
  return result.error;
};
