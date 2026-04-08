
// Puerto Secundario: EmpleadoRepositoryPort
// Define el contrato que debe cumplir cualquier adaptador de persistencia


export class EmpleadoRepositoryPort {

  findById(_id)      { throw new Error('findById no implementado'); }
  findAll()          { throw new Error('findAll no implementado'); }
  save(_empleado)    { throw new Error('save no implementado'); }
  delete(_id)        { throw new Error('delete no implementado'); }
}

