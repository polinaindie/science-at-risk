# encoding: utf-8
# Usage: ruby validate.rb   (in this folder). Parses every *.yaml and checks that too_long strings hit their limits.
require 'yaml'
Encoding.default_external = Encoding::UTF_8
LIMITS = {
  'scientist' => {'title'=>80,'post'=>200,'institution'=>250,'research_area'=>3000,'duties'=>3000,'photo_alt'=>125},
  'institution' => {'short_name'=>60,'full_name'=>160,'body'=>3000,'city'=>40,'infrastructure_type'=>250,'property_type'=>40,'needed_note'=>120,'purpose'=>400},
  'society' => {'title'=>120,'summary'=>700,'basic_info'=>4000,'regions'=>1000,'projects'=>3000,'collaboration'=>1500,'donors'=>1500},
  'research' => {'title'=>160,'authors'=>250,'summary'=>1200,'body'=>8000},
  'story' => {'title'=>170,'excerpt'=>200,'hero_alt'=>125,'body'=>30000},
  'page' => {'title'=>80,'body'=>10000},
}
ok = true
Dir['*.yaml'].sort.each do |f|
  d = YAML.load_file(f)
  miss = %w[normal too_long empty].reject { |k| d.key?(k) }
  puts "#{f}: parsed, variants=#{d.keys.join(',')}#{miss.empty? ? '' : ' MISSING ' + miss.join(',')}"
  ok &&= miss.empty?
  t = File.basename(f, '.yaml')
  (LIMITS[t] || {}).each do |field, max|
    %w[en uk].each do |lang|
      v = d.dig('too_long', lang, field)
      n = v.to_s.length
      bad = n < max
      ok &&= !bad
      puts "  too_long.#{lang}.#{field}: #{n}/#{max}#{bad ? '  UNDER LIMIT' : ''}"
    end
  end
end
exit(ok ? 0 : 1)
