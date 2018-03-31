class BookSerializer < ActiveModel::Serializer
  attributes :id, :title 
  belongs_to :author
end
