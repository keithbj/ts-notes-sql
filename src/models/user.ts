import { DataTypes, Model, Optional } from 'sequelize';
import { Request } from 'express';
import Joi from 'joi';

import { sequelize } from '../startup/database';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
}

// 'id' property declared optional as auto created.
//
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

// Add user to request, making it optional '?' and postfix '!'. To resolve inference issues.
//
export interface UserRequest extends Request {
  user?: UserInstance;
}

export const User = sequelize.define<UserInstance>('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const validate = (values: any) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(256).required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
  });
  const result = schema.validate(values, { abortEarly: false });
  return result.error;
};
