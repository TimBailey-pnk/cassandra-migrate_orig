'use strict'

/**
 * A method to create incremental new migrations
 * on create migration command.
 * e.g. cassandra-migration create
 * @param path
 */

const create = (templateFile, folder, fsOverride) => {
  const dateString = Math.floor(Date.now() / 1000) + ''
  const migrationsFolder = folder || process.cwd()
  const fs = fsOverride || require('fs')

  let template = `
const migration${dateString} = {
  up: function (db, handler) {
    // Prefer to return a promise, handdler is deprecated and will be removed in a future version
    // db is https://github.com/datastax/nodejs-driver
  },

  down: function (db, handler) {
    // Prefer to return a promise, handdler is deprecated and will be removed in a future version
    // db is https://github.com/datastax/nodejs-driver
  }
}

module.exports = migration${dateString}`

  if (templateFile) {
    template = fs.readFileSync(templateFile)
    /* eslint no-new-func: 0 */
    let tpl = new Function('dateString', 'return `' + template + '`;')
    template = tpl(dateString)
  }

  return {
    newMigration: (title) => {
      /* eslint no-useless-escape: 0 */
      const reTitle = /^[a-z0-9\_]*$/i
      if (!reTitle.test(title)) {
        console.log("Invalid title. Only alphanumeric and '_' title is accepted.")
        process.exit(1)
      }

      const fileName = `${dateString}_${title}.js`
      fs.writeFileSync(`${migrationsFolder}/${fileName}`, template)
      console.log(`Created a new migration file with name ${fileName}`)
    }
  }
}

module.exports = create
