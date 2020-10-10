class CreateInventories < ActiveRecord::Migration[5.1]
  def change
    create_table :inventories do |t|
      t.string :productid
      t.string :productname
      t.string :vendor
      t.string :mrp
      t.string :batchnum
      t.string :batchdate
      t.string :quantity
      t.string :status
      t.string :modifiedby
      t.string :lastoperation

      t.timestamps
    end
  end
end
