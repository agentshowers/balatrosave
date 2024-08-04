require 'zlib'
require 'pry'

def decompress(file_name)
  zstream = Zlib::Inflate.new(-Zlib::MAX_WBITS)
  buf = zstream.inflate(File.read(file_name))
  zstream.finish
  zstream.close
  buf
end

def parse(str)
  str = str.gsub(/\["?([\w\s]+)"?\]=/) do
    match = Regexp.last_match
    "\"#{match.captures[0]}\": "
  end
  str = str.gsub(/,}/,"}")
  str = str.gsub("return ", "")
  str
end

puts parse(decompress(ARGV[0]))
