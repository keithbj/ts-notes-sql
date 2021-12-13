import { RequestHandler, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';

import { Note, validate } from '../models/note';
import { UserRequest } from '../models/user';
import * as reqErrors from '../util/requestErrors';

export const createNote: RequestHandler = async (req: UserRequest, res: Response) => {
  const values = {
    userId: req.user!.id,
    content: req.body.content,
    attachment: req.body.attachment,
  };

  const error = validate(values);

  if (error) {
    reqErrors.badRequest(res, 'createNote failed validation: ', error!);
  } else {
    const note = await Note.create(values);
    res.status(HttpStatus.CREATED).send(note);
  }
};

export const getNotes: RequestHandler = async (req, res, next) => {
  const notes = await Note.findAll();
  res.send(notes);
};

export const updateNote: RequestHandler = async (req: UserRequest, res: Response) => {
  const values = {
    userId: req.user!.id,
    content: req.body.content,
    attachment: req.body.attachment,
  };

  const error = validate(values);
  if (error) {
    return reqErrors.badRequest(res, 'updateNote failed validation: ', error);
  }

  let note = await Note.findByPk(req.params.id);
  if (!note) {
    return reqErrors.notFound(res, `getNote noteId "${req.params.id}" not found.`);
  }

  try {
    note = await note.update(values);
    res.send(note);
  } catch (error) {
    reqErrors.serverError(res, 'updateNote failed: ');
  }
};

export const deleteNote: RequestHandler = async (req, res) => {
  let note = await Note.findByPk(req.params.id);
  if (!note) {
    return reqErrors.notFound(res, `deleteNote noteId "${req.params.id}" not found.`);
  }

  try {
    await note.destroy();
    res.send(note);
  } catch (error) {
    reqErrors.serverError(res, `deleteNote failed for noteId:"${req.params.id}" failed`);
  }
};

export const getNote: RequestHandler = async (req, res) => {
  const note = await Note.findByPk(req.params.id);

  if (!note) {
    reqErrors.notFound(res, `getNote noteId "${req.params.id}" not found.`);
  } else {
    res.send(note);
  }
};
