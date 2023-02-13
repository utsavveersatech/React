class FixColumnName < ActiveRecord::Migration[6.1]
  def self.up
    rename_column :userroles, :roleid, :role_id
    rename_column :userroles, :userid, :user_id
  end
end
