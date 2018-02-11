class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  devise :omniauthable, omniauth_providers: %i[facebook]

  has_many :book_lists
  has_many :reviews

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
    end
  end

  def books
    books = []
    @booklists = BookList.where(user_id: self.id).each do |booklist|
      booklist.books.each do |book|
        books << book
      end
    end
    books
  end

  def books_by_status(status)
    array = []
    books = self.books.each do |book|
      book.book_features.each do |book_feature|
        if book_feature.status == "#{status}"
          array << Book.find_by(id: book_feature.book_id)
        end
      end
    end
    array
  end

end
