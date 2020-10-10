class CreateUserroles < ActiveRecord::Migration[5.1]
  def change
    create_table :userroles do |t|
      t.integer :userid
      t.integer :roleid

      t.timestamps
    end
  end
end
