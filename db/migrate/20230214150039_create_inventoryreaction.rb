class CreateInventoryreaction < ActiveRecord::Migration[6.1]
  def change
    create_table :inventoryreactions do |t|
      t.integer :reaction_id
      t.integer :inventory_id
      t.timestamps
    end
  end
end
