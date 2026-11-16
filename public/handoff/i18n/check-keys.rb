#!/usr/bin/env ruby
# Usage: ruby check-keys.rb   (run in this folder)
# Parses both tables, rejects duplicate keys, and compares the key sets.
# Plural entries (one/few/many/other maps) count as one key; EN needs one+other, UK needs one+few+many+other.
# encoding: utf-8
require "yaml"
Encoding.default_external = Encoding::UTF_8
def load(f)
  raw = File.read(f).lines.map { |l| l[/\A([A-Za-z0-9_.]+):/, 1] }.compact
  dup = raw.group_by { |k| k }.select { |_, v| v.size > 1 }.keys
  [YAML.load_file(f), dup]
end
en, d1 = load('ui.en.yaml'); uk, d2 = load('ui.uk.yaml')
puts "duplicates en: #{d1.inspect}  uk: #{d2.inspect}"
puts "keys en=#{en.size} uk=#{uk.size}"
puts "missing in uk: #{(en.keys - uk.keys).inspect}"
puts "missing in en: #{(uk.keys - en.keys).inspect}"
bad = []
en.each { |k, v| bad << k if v.is_a?(Hash) && !(v.keys.sort == %w[one other]) }
uk.each { |k, v| bad << k if v.is_a?(Hash) && !(v.keys.sort == %w[few many one other]) }
en.each { |k, v| bad << "#{k} (plural in only one file)" if v.is_a?(Hash) != uk[k].is_a?(Hash) }
puts "bad plural forms: #{bad.inspect}"
ph = ->(s) { s.to_s.scan(/\{\{\s*\.(\w+)\s*\}\}/).flatten.sort.uniq }
pm = []
en.each { |k, v| a = v.is_a?(Hash) ? v.values.flat_map(&ph).uniq.sort : ph.(v); b = uk[k].is_a?(Hash) ? uk[k].values.flat_map(&ph).uniq.sort : ph.(uk[k]); pm << k if a != b }
puts "placeholder mismatch: #{pm.inspect}"
puts "TODO translate lines in uk: #{File.read('ui.uk.yaml').scan('# TODO translate').size}; DRAFT-UK: #{File.read('ui.uk.yaml').scan('# DRAFT-UK').size}"
exit((d1 + d2 + (en.keys - uk.keys) + (uk.keys - en.keys) + bad + pm).empty? ? 0 : 1)
