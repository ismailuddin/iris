from .. import db


class ConfigValue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(256))
    value = db.Column(db.String(256))


    @staticmethod
    def set_database_file(uri: str):
        db.session.add(
            ConfigValue(
                key="sqlite_database_uri",
                value=uri
            )
        )
        db.session.commit()

    @staticmethod
    def set_folder(folder: str):
        db.session.add(
            ConfigValue(
                key="folder",
                value=folder
            )
        )
        db.session.commit()

    @staticmethod
    def get_folder() -> str:
        return ConfigValue.query.filter_by(key="folder").first().value